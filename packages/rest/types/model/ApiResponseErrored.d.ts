import AbstractApiResponse from './AbstractApiResponse'
import { AxiosError } from 'axios'
export default class ApiResponseErrored extends AbstractApiResponse {
    code: string | undefined;
    message: string;
    name: string;
    constructor(response: AxiosError);
}
