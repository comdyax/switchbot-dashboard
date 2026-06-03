"""Unit tests for app.config.Settings."""

import pytest

from app.config import Settings


def _make_settings(monkeypatch: pytest.MonkeyPatch, **env: str) -> Settings:
    """Build Settings from a controlled environment, ignoring any .env file."""
    monkeypatch.setenv("DATABASE_URL", "postgresql://user:pass@db:5432/switchbot")
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    for key, value in env.items():
        monkeypatch.setenv(key, value)
    return Settings(_env_file=None)


class TestCorsOrigins:
    def test_defaults_when_unset(self, monkeypatch: pytest.MonkeyPatch) -> None:
        settings = _make_settings(monkeypatch)
        assert settings.CORS_ORIGINS == ["http://localhost:5173"]

    def test_single_origin(self, monkeypatch: pytest.MonkeyPatch) -> None:
        settings = _make_settings(monkeypatch, CORS_ORIGINS="http://localhost:5173")
        assert settings.CORS_ORIGINS == ["http://localhost:5173"]

    def test_comma_separated_is_split(self, monkeypatch: pytest.MonkeyPatch) -> None:
        settings = _make_settings(
            monkeypatch,
            CORS_ORIGINS="http://localhost:5173,http://192.168.1.50:5173",
        )
        assert settings.CORS_ORIGINS == [
            "http://localhost:5173",
            "http://192.168.1.50:5173",
        ]

    def test_whitespace_and_empty_entries_are_stripped(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        settings = _make_settings(
            monkeypatch,
            CORS_ORIGINS=" http://localhost:5173 , http://192.168.1.50:5173 ,",
        )
        assert settings.CORS_ORIGINS == [
            "http://localhost:5173",
            "http://192.168.1.50:5173",
        ]


class TestAsyncDatabaseUrl:
    @pytest.mark.parametrize(
        "url, expected",
        [
            (
                "postgresql://user:pass@db:5432/switchbot",
                "postgresql+asyncpg://user:pass@db:5432/switchbot",
            ),
            (
                "postgres://user:pass@db:5432/switchbot",
                "postgresql+asyncpg://user:pass@db:5432/switchbot",
            ),
            (
                "postgresql+asyncpg://user:pass@db:5432/switchbot",
                "postgresql+asyncpg://user:pass@db:5432/switchbot",
            ),
        ],
    )
    def test_driver_is_normalised_to_asyncpg(
        self, monkeypatch: pytest.MonkeyPatch, url: str, expected: str
    ) -> None:
        settings = _make_settings(monkeypatch, DATABASE_URL=url)
        assert settings.async_database_url == expected
