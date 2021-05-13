import axios from "axios";
import { SageResponse } from "../types";

export const callSageMaker = async (data: {
  data: string;
}): Promise<string | undefined> => {
  try {
    const response = await axios.post<SageResponse>(
      "https://4dzakqq057.execute-api.eu-west-1.amazonaws.com/dev/predictprofile",
      { data: data.data }
    );
    if (response.data.length) {
      const num = response.data[0].closest_cluster.toString().split(".")[0];
      return num;
    } else return [] as any
  } catch (error) {
    console.log("sage call error", error);
  }
};
