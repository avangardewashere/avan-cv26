export type Education = {
  credential: string;
  school: string;
  location: string;
  period: string;
};

export const education = [
  {
    credential: "BS Computer Science",
    school: "Manuel S. Enverga University",
    location: "Candelaria, Quezon",
    period: "2019–2021",
  },
  {
    credential: "Technical Vocational ICT",
    school: "AMA Computer Learning Center",
    location: "San Pablo City, Laguna",
    period: "2017–2019",
  },
] as const satisfies readonly Education[];
