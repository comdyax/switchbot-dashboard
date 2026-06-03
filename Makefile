# SwitchBot Dashboard — common dev commands.
# Run `make` or `make help` to see available targets.

BACKEND_DIR := backend
PYTHON      := python

.DEFAULT_GOAL := help

##@ General

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: make \033[36m<target>\033[0m\n"} \
		/^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } \
		/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)

##@ Backend

install-backend: ## Install backend deps incl. test tooling
	cd $(BACKEND_DIR) && pip install -r requirements-dev.txt

test-backend: ## Run backend unit tests
	cd $(BACKEND_DIR) && $(PYTHON) -m pytest

dev-backend: ## Run backend with autoreload (reachable on the local network)
	cd $(BACKEND_DIR) && $(PYTHON) -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

.PHONY: help install-backend test-backend dev-backend
