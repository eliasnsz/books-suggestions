export class BaseError extends Error {
  public action: string;
  public statusCode: number;

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      cause: this.cause,
      status_code: this.statusCode,
    };
  }
}

export class InternalServerError extends BaseError {
  constructor(props?: Partial<{ cause: string; statusCode: number }>) {
    super("Ocorreu um erro interno inesperado.", {
      cause: props?.cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = props?.statusCode ?? 500;
  }
}

export class ServiceError extends BaseError {
  constructor(
    props?: Partial<{ message: string; cause: string; action: string }>,
  ) {
    super(props?.message ?? "Serviço indisponível no momento.", {
      cause: props?.cause,
    });
    this.name = "ServiceError";
    this.action = props?.action ?? "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }
}

export class UnauthorizedError extends BaseError {
  constructor(props?: Partial<{ message: string; action: string }>) {
    super(
      props?.message ?? "Você deve estar autenticado para realizar esta ação.",
    );
    this.name = "UnauthorizedError";
    this.action = props?.action ?? "Faça login e tente novamente.";
    this.statusCode = 401;
  }
}

export class NotFoundError extends BaseError {
  constructor(props?: Partial<{ message: string; action: string }>) {
    super(
      props?.message ?? "O recurso desejado não foi encontrado no sistema.",
    );
    this.name = "NotFoundError";
    this.action = props?.action ?? "Confira os dados e tente novamente.";
    this.statusCode = 404;
  }
}
