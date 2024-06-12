
export const getValidationMessage = (valResult: any) => {
    const errType = valResult?.error?.details[0].path[0];
    const errText = valResult?.error?.details[0].message;

    return [errType, errText];
}