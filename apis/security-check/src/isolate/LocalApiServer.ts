
import {
    ILocalAPIRequest,
    ILocalAPIResponse
} from "@airport/autopilot";

export interface ILocalAPIServer {

    handleRequest(
        request: ILocalAPIRequest
    ): Promise<ILocalAPIResponse>

}