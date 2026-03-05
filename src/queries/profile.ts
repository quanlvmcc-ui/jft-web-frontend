import profileApiRequest from "@/apiRequest/profile";
import { useQueryClient } from "@tanstack/react-query";

import {
  ChangePasswordBodyType,
  ExamHistoryItemResponseType,
  UpdateProfileBodyType,
  UserProfileResponseType,
} from "@/schemaValidations/profile.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserProfileQuery = () => {
  return useQuery<UserProfileResponseType>({
    queryKey: ["profile"],
    queryFn: () => profileApiRequest.getUserProfile(),
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateProfileBody: UpdateProfileBodyType) =>
      profileApiRequest.updateProfile(updateProfileBody),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (changePasswordBody: ChangePasswordBodyType) =>
      profileApiRequest.changePassword(changePasswordBody),
  });
};

export const useExamHistoryQuery = () => {
  return useQuery<ExamHistoryItemResponseType[]>({
    queryKey: ["examHistory"],
    queryFn: () => profileApiRequest.getExamHistory(),
  });
};

// Upload avatar hook - KHÔNG invalidate ở đây vì chưa update profile
export const useUploadAvatarMutation = () => {
  return useMutation({
    mutationFn: (file: File) => profileApiRequest.uploadAvatar(file),
    // onSuccess bị remove - sẽ invalidate sau khi updateProfile
  });
};
