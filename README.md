
# Bidirectional_chat

This project introduces a real-time chat application powered by Centrifugo, a cutting-edge tool for instantaneous messaging. With Centrifugo, users can exchange messages in real-time, fostering seamless communication.

## Components

1. **Backend**: The backend component comprises APIs responsible for managing chat-related functionalities.

2. **Authentication Shield**: Ensures secure access to the chat app system by implementing robust authentication mechanisms to protect sensitive user data and system functionalities.

## Prerequisites

Before getting started, ensure the following prerequisites are met:

- Docker installed on your machine
- BB CLI (BB Command Line Interface) installed

## Getting Started

1. **Clone Repository**: Begin by cloning the repository to your local machine.
   
2. **Install centrifugo**: Execute the following command in your project's root terminal
   ```bash
   curl -sSLf https://centrifugal.dev/install.sh | sh
   ```
   For more : https://centrifugal.dev/docs/getting-started/quickstart

3. **Generate config file** : Execute the following command in your project root terminal. Afterward, customize the configuration according to your preferences.
   ```bash
   ./centrifugo genconfig
   ```
4. **Build Docker Compose**: Execute the following commands in your terminal:
    ```bash
    docker compose build
    ```

5. **Start the Project**: Once the build process is complete, start the project with:
    ```bash
    docker compose up
    ```
## License

This project is licensed under the [MIT License](LICENSE).
