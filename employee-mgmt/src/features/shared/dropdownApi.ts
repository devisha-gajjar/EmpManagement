import axiosClient from "../../api/axiosClient"; // path to your axios file
import type { DropDownType } from "../../enums/enum";
import type { ApiResponse } from "../../interfaces/apiResponse.interface";
import type { CommonListDropDownDto } from "../../interfaces/dropdown.interface";


export async function getDropDownData(
    type: DropDownType
): Promise<CommonListDropDownDto[]> {
    const response = await axiosClient.get<
        ApiResponse<CommonListDropDownDto[]>
    >("/DropDownData/get-dropdown-data", {
        params: { type },
    });

    return response.data.data;
}
