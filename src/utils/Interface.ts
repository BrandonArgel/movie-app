import React from "react";

export interface CardInterface {
  adult: boolean;
  id?: number;
  img: string;
  link: string;
  loading?: boolean;
  overview: string;
  title: string;
  voteAverage: number;
  slide?: boolean;
}

export interface MovieInterface {
  adult: boolean;
  children: React.ReactNode;
  id: number;
  backdrop: string;
  loading: boolean;
  genres: any[];
  overview: string;
  title: string;
  voteAverage: number;
}