from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NyayaFlow AI"
    DATABASE_URL: str = "sqlite:///./nyayaflow.db"
    GEMINI_API_KEY: str = ""
    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
