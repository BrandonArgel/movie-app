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
  getFavorite?: (lang: string, session_id: string, account_id: number) => void;
  getWatchLater?: (lang: string, session_id: string, account_id: number) => void;
  getRated?: (lang: string, session_id: string, account_id: number) => void;
}

export interface CardActorInterface {
  adult: boolean;
  character: string;
  height?: number;
  id: number;
  img: string;
  link: string;
  name: string;
  popularity: number;
  slide?: boolean;
  width?: number;
}

export interface MovieInterface {
  adult: boolean;
  backdrop: string;
  children: React.ReactNode;
  id: number;
  loading: boolean;
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
