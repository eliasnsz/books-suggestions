export class BaseError extends Error {
  public action: string;
  public statusCode: number;
  public context?: Record<string, any>;

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      cause: this.cause,
      context: this.context,
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

export class ValidationError extends BaseError {
  public context?: Record<string, any>;

  constructor(
    props?: Partial<{
      message: string;
      action: string;
      context?: Record<string, any>;
    }>,
  ) {
    super(props?.message ?? "Ocorreu um erro ao validar os dados enviados.");
    this.name = "ValidationError";
    this.action = props?.action ?? "Ajuste os dados e tente novamente.";
    this.context = props?.context ?? undefined;
    this.statusCode = 400;
  }
}

export class ForbiddenError extends BaseError {
  constructor(props?: Partial<{ message: string; action: string }>) {
    super(
      props?.message ?? "Você não possui permissão para executar esta ação.",
    );
    this.name = "ForbiddenError";
    this.action =
      props?.action ??
      "Verifique se você possui permissão para realizar esta ação.";
    this.statusCode = 403;
  }
}
