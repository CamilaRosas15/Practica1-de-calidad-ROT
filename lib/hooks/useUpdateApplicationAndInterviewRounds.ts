import { API } from "@/lib/constants/apiRoutes";
import { InterviewExperienceFormValues } from "@/lib/schema/updateInterviewRoundSchema";
import actionUpdateApplicationAndInterviewRounds from "@/app/actions/updateApplicationAndInterviewRounds";
import { ClerkAuthUserId, mutateWithAuthKey, useSWRMutationWithAuthKey } from "@/lib/hooks/useSWRWithAuthKey";

export const useUpdateApplicationAndInterviewRounds = (application_id: string, userId: ClerkAuthUserId) => {
  const { trigger, isMutating } = useSWRMutationWithAuthKey(API.INTERVIEW.getAllByApplicationId(application_id), userId, actionUpdateApplicationAndInterviewRounds);

  return {
    updateApplicationAndInterviewRounds: async (data: InterviewExperienceFormValues) => {
      try {
        await trigger({
          ...data,
          application_id,
        });

        mutateWithAuthKey(API.APPLICATION.getByApplicationId(application_id), userId); // Only need to manually mutate applicationDetails as they share hook
      } catch (err) {
        console.error("Error updating application and interview rounds:", err);
        throw err;
      }
    },
    isUpdating: isMutating,
  };
};
