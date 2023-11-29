
export interface EmailParams {
    Destination: {
      CcAddresses?: string[];
      ToAddresses: string[];
    };
    Message: {
      Body: {
        Html: {
          Charset: string;
          Data: string;
        };
        Text: {
          Charset: string;
          Data: string;
        };
      };
      Subject: {
        Charset: string;
        Data: string;
      };
    };
    Source: string;
    ReplyToAddresses?: string[];
  }