import { Rule } from 'eslint';
import { types } from '@babel/core';

export const staticControlFlow = {
  create: (context: Readonly<Rule.RuleContext>): Rule.RuleListener => {
    return {
      VariableDeclarator(node: any) {
        if (types.isVariableDeclarator(node)) {
          if (
            types.isObjectPattern(node.id) &&
            types.isIdentifier(node.init) &&
            node.init.name === 'state'
          ) {
            context.report({
              node: node as any,
              message: 'You cannot destructure state asshole',
            });
          }
        }
      },

      JSXExpressionContainer(node: any) {
        if (types.isJSXExpressionContainer(node)) {
          if (types.isConditionalExpression(node.expression)) {
            context.report({
              node: node as any,
              message:
                'Static rendering is required. E.g. {foo ? bar : baz} should be <Show when={foo}>{bar}</Show>',
            });
          }
          if (types.isCallExpression(node.expression)) {
            const firstArg = node.expression.arguments[0];
            if (
              types.isArrowFunctionExpression(firstArg) ||
              types.isFunctionExpression(firstArg)
            ) {
              context.report({
                node: node as any,
                message:
                  'Static rendering is required. E.g. {foo.map(...)} should be <For each={foo}>{...}</For>',
              });
            }
          }
        }
      },
    };
  },
};

export const rules = {
  'static-control-flow': staticControlFlow,
};
