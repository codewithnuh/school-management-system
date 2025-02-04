import fs from 'fs'
import yaml from 'js-yaml'
import swaggerSpec from './swagger'

async function generateOpenAPIYaml() {
    try {
        const yamlContent = yaml.dump(swaggerSpec, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
        })

        fs.writeFileSync('./openapi.yml', yamlContent, 'utf8')
        console.log('Successfully generated openapi.yml')
    } catch (error) {
        console.error('Error generating OpenAPI YAML:', error)
    }
}

generateOpenAPIYaml()
