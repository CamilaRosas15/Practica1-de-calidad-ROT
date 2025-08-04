// hooks/useCreateNote.ts
import useSWRMutation from "swr/mutation";

import actionCreateCompany from "@/app/actions/createCompany";
import { CompanyFormData } from "@/lib/schema/addCompanySchema";
import { API } from "@/lib/constants/apiRoutes";

const useCreateCompany = () => {
  const { trigger, isMutating } = useSWRMutation(API.COMPANY.getAll, actionCreateCompany);

  return {
    createCompany: async (newCompany: CompanyFormData) => {
      const result = await trigger(newCompany);

      if (!result.isSuccess) {
        // Create an error object with the returned error message
        throw new Error(result.error);
      }
    },
    isCreating: isMutating,
  };
};

export { useCreateCompany };
