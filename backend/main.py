import uvicorn

from prek.core.config import settings
from prek.core.database import create_tables


def main():
    create_tables()
    uvicorn.run(
        "prek.api.server:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
    )


if __name__ == "__main__":
    main()
