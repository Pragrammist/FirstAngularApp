//данные которые отсылаются серверу
export interface ChangeUserDataModel {
  currentPassword : string | undefined
  newLogin: string | undefined;
  newEmail: string | undefined;
  newPassword: string | undefined;


}
