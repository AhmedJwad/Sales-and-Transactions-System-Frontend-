export interface LoginResponseDto {
  token: string;
  expiration: string;
  refreshToken: string;
  refreshTokenExpiration: string;
}