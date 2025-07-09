"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
exports.createUserContainer = createUserContainer;
const user_controller_1 = require("./presentation/controllers/user.controller");
const get_user_profile_usecase_1 = require("./application/use-cases/get-user-profile.usecase");
const update_user_profile_usecase_1 = require("./application/use-cases/update-user-profile.usecase");
const get_all_users_usecase_1 = require("./application/use-cases/get-all-users.usecase");
const delete_user_usecase_1 = require("./application/use-cases/delete-user.usecase");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
// Create DI Container
function createUserContainer() {
    return {
        userRepository: new user_repository_1.PrismaUserRepo(),
        getUserProfileUseCase: new get_user_profile_usecase_1.GetUserProfileUseCase(new user_repository_1.PrismaUserRepo()),
        updateUserProfileUseCase: new update_user_profile_usecase_1.UpdateUserProfileUseCase(new user_repository_1.PrismaUserRepo()),
        getAllUsersUseCase: new get_all_users_usecase_1.GetAllUsersUseCase(new user_repository_1.PrismaUserRepo()),
        deleteUserUseCase: new delete_user_usecase_1.DeleteUserUseCase(new user_repository_1.PrismaUserRepo()),
    };
}
// Create User Controller with DI
function createUserController() {
    const container = createUserContainer();
    return new user_controller_1.UserController(container.getUserProfileUseCase, container.updateUserProfileUseCase, container.getAllUsersUseCase, container.deleteUserUseCase);
}
