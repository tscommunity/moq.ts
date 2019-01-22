import { SetPropertyExpression } from "../expressions";
import { ConstantFormatter } from "./constant-formatter";

/**
 * @hidden
 */
export class SetPropertyExpressionFormatter {

    constructor(private constantFormatter: ConstantFormatter = new ConstantFormatter()) {

    }

    public format(expression: SetPropertyExpression): string {
        const value = this.constantFormatter.format(expression.value);
        return `Assignment of ${value} to property \'${expression.name}\'`;
    }
}
