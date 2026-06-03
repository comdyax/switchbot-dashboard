from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    # Same value the scanner uses, e.g. postgresql://user:pass@host:5432/db
    DATABASE_URL: str

    # Allowed origins for the React frontend (comma-separated in .env)
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    @property
    def async_database_url(self) -> str:
        """Force the asyncpg driver for SQLAlchemy's async engine."""
        url = self.DATABASE_URL
        if url.startswith("postgresql+asyncpg://"):
            return url
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url


settings = Settings()
