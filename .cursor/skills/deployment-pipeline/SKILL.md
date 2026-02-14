---
name: deployment-pipeline
description: 'Ian (DevSecOps): Ontwerpt en implementeert CI/CD pipelines, container configuraties (Docker/K8s) en infrastructure-as-code. Activeer bij nieuwe projecten of deployment wijzigingen.'
---

# Deployment Pipeline Skill

## Doel
Zorgen voor een veilige, herhaalbare en geautomatiseerde weg van code naar productie.

## Wanneer te activeren
- Start van een nieuw project
- Toevoegen van nieuwe services die gedeployed moeten worden
- Optimaliseren van bestaande deployment processen

## Werkwijze (Stap voor Stap)

### Stap 1: Analyse & Containerisatie
- Check of er een Dockerfile bestaat. Zo niet, maak er een aan volgens best practices (multi-stage builds, non-root user, minimal base image)
- Definieer docker-compose.yml voor lokale development (inclusief database, redis, etc.)

### Stap 2: CI/CD Workflow (GitHub Actions)
- Maak een workflow bestand aan in `.github/workflows/`
- **Fases**:
  - **Build**: Install dependencies, build artifacts
  - **Test**: Run unit tests, integration tests
  - **Security Scan**: Voer Snyk of Trivy uit (Security Gate)
  - **Deploy (Staging)**: Automatische deploy bij merge naar develop
  - **Deploy (Prod)**: Manuele approval vereist bij merge naar main

### Stap 3: Security Integratie
- Zorg dat secrets nooit hardcoded zijn (gebruik GitHub Secrets)
- Voeg OWASP ZAP baseline scan toe aan de pipeline

### Stap 4: Kubernetes (Optioneel, indien van toepassing)
- Genereer basis Helm charts of Kubernetes manifests in `deploy/k8s/`
- Zorg voor liveness/readiness probes

## Output Voorbeeld
```yaml
# .github/workflows/deploy.yml (gegenereerd door Ian)
name: Deploy Pipeline
on:
  push:
    branches: [main]
jobs:
  build-and-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Run Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'table'
          exit-code: '1'  # Faalt de pipeline bij vulnerabilities
```
