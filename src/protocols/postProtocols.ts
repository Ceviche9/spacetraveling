export type PostProps = {
  uid: string;
  first_publication_date: string | null;
  last_publication_date?: string;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
      count: number;
    }[];
  };
};

export type prismicResponseProps = {
  post: PostProps;
  sugestions: {
    prevPost?: {
      uid: string;
      data: {
        title: string;
      };
    }[];
    nextPost?: {
      uid: string;
      data: {
        title: string;
      };
    }[];
  };
};
