export type JwtToken = {
  access: string;
  refresh: string;
};

export type Choice = {
  pokedex_id: number;
  pokemon_name: string;
};

export type Question = {
  pokedex_id: number;
  pokemon_name: string;
  genus: string;
  characteristic: string;
  image_path: string;
  dummys: Choice[];
};

export type Answer = {
  question_num: number;
  choice_pokedex_id: number;
  choice_pokemon_name: string;
  correct_pokedex_id: number;
  correct_pokemon_name: string;
  is_correct: boolean;
  image_path: string;
};

export type EmitDoneAnswer = {
  answered_state: Answer[];
  correct_point: number;
  fail_point: number;
};
