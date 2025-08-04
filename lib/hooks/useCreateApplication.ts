import { ClerkAuthUserId, useSWRMutationWithAuthKey } from "./useSWRWithAuthKey";

import actionCreateApplication, { CreateApplicationArgs } from "@/app/actions/createApplication";
import { API } from "@/lib/constants/apiRoutes";

type CreateApplicationParams = StrictOmit<CreateApplicationArgs, "job_posting_id">;

export const useCreateApplication = (job_posting_id: string, userId: ClerkAuthUserId) => {
  const { trigger, isMutating } = useSWRMutationWithAuthKey(API.APPLICATION.getAllByJobPostingId(job_posting_id), userId, actionCreateApplication);

  return {
    createApplication: async (params: CreateApplicationParams): Promise<void> => {
      const result = await trigger({ job_posting_id, ...params });

      if (!result.isSuccess) {
        throw new Error(result.error);
      }
    },
    isCreating: isMutating,
  };
};
