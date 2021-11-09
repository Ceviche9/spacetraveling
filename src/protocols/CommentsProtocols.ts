export type CommentsProps = {
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
