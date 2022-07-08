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