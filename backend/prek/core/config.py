from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./prek.db"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    default_pin: str = "1234"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
