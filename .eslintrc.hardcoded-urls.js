/**
 * ESLint规则：防止硬编码URL
 * 在开发过程中实时检测硬编码URL
 */

module.exports = {
  rules: {
    'no-hardcoded-urls': {
      create: function(context) {
        return {
          Literal: function(node) {
            if (typeof node.value === 'string') {
              const value = node.value;
              
              // 检查是否包含硬编码URL
              const hardcodedPatterns = [
                /https:\/\/periodhub\.health/,
                /https:\/\/www\.periodhub\.health/,
              ];
              
              const hasHardcoded = hardcodedPatterns.some(pattern => 
                pattern.test(value)
              );
              
              if (hasHardcoded) {
                context.report({
                  node: node,
                  message: '禁止使用硬编码URL，请使用 URL_CONFIG.getUrl() 或环境变量',
                  suggest: [
                    {
                      desc: '使用 URL_CONFIG.getUrl()',
                      fix: function(fixer) {
                        return fixer.replaceText(
                          node,
                          `URL_CONFIG.getUrl('${value.replace(/https:\/\/[^\/]+/, '')}')`
                        );
                      }
                    }
                  ]
                });
              }
            }
          },
          
          TemplateLiteral: function(node) {
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText(node);
            
            // 检查模板字符串中的硬编码URL
            const hardcodedPatterns = [
              /https:\/\/periodhub\.health/,
              /https:\/\/www\.periodhub\.health/,
            ];
            
            const hasHardcoded = hardcodedPatterns.some(pattern => 
              pattern.test(text)
            );
            
            if (hasHardcoded) {
              context.report({
                node: node,
                message: '禁止在模板字符串中使用硬编码URL，请使用 URL_CONFIG.getUrl() 或环境变量',
              });
            }
          }
        };
      }
    }
  }
};
