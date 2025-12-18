export interface ApiResponse<T> {
    result: boolean;
    message: string;
    statusCode: number;
    data: T;
}
