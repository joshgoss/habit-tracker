import { IUser, User } from "./users/models";
import { faker } from "@faker-js/faker";
import { generateAccessToken } from "./auth/utils";
import { AuthProvider } from "./constants";

interface TestCredentials {
	user: IUser;
	accessToken: string;
}

export const createUser = async (
	authProvider: AuthProvider = AuthProvider.Google
): Promise<IUser> => {
	return await User.create({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		provider: authProvider,
		providerUserId: faker.random.numeric(),
	});
};

export const loginUser = (user: IUser): string => {
	return generateAccessToken({ sub: user._id, provider: user.provider });
};

export const createAndLoginUser = async (
	authProvider: AuthProvider = AuthProvider.Google
): Promise<TestCredentials> => {
	const user = await createUser(authProvider);
	return { user: user, accessToken: loginUser(user) };
};
