export type SaveRefreshToken = {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
};

export type VerifyRefreshToken = {
  userId: string;
  refreshToken: string;
};

export type UpdateRefreshToken = {
  userId: string;
  refreshToken: string;
  refreshTokenHash: string;
  expiresAt: Date;
};

export type DeleteRefreshToken = {
  userId: string;
  refreshToken: string;
};
