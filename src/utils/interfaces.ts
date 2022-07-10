import React from "react";

export interface CardInterface {
  adult?: boolean;
  height?: number;
  id?: number;
  img?: string;
  link?: string;
  overview?: string;
  slide?: boolean;
  title?: string;
  voteAverage?: number;
  width?: number;
}

type accountState = {
  id?: number;
  favorite: boolean;
  watchlist: boolean;
  rated: boolean;
}

export interface MovieInterface {
  adult: boolean;
  accountState: accountState;
  children: React.ReactNode;
  id: number;
  backdrop: string;
  loading: boolean;
  loadingState: boolean;
  genres: any[];
  overview: string;
  sessionId: string;
  title: string;
  voteAverage: number;
}

export interface SelectOption {
	name: string;
	iso: string;
}