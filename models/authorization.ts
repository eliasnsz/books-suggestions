import { ForbiddenError, ValidationError } from "@/errors";
import type { User } from "./user";
import availableFeatures from "./user-features";

function can(user: User, feature: string) {
  validateUser(user);
  validateFeature(feature);

  return user.features.includes(feature);
}

function validateUser(user: User) {
  if (!user) {
    throw new ValidationError({
      message: `Nenhum "user" foi especificado para a ação de autorização.`,
      action: "Se o erro persistir, contate o suporte.",
    });
  }

  if (!user.features || !Array.isArray(user.features)) {
    throw new ValidationError({
      message: `O "user" informado não possui "features" ou não é um array.`,
      action: "Se o erro persistir, contate o suporte.",
    });
  }
}

function validateFeature(feature: string) {
  if (!feature) {
    throw new ValidationError({
      message: `Nenhuma "feature" foi especificada para a ação de autorização.`,
      action: "Se o erro persistir, contate o suporte.",
    });
  }

  if (!availableFeatures.has(feature)) {
    throw new ValidationError({
      message: `A "feature" informada não está disponível na lista de features existentes.`,
      action: "Se o erro persistir, contate o suporte.",
      context: {
        feature: feature,
      },
    });
  }
}

function canRequest(userTryingToRequest: User, feature: string) {
  if (!userTryingToRequest.features.includes(feature)) {
    throw new ForbiddenError({
      message: "Usuário não pode executar esta ação.",
      action: `Verifique se o usuário possui a feature "${feature}".`,
    });
  }
}

export default Object.freeze({
  can,
  canRequest,
});
