# Details

Date : 2025-11-20 23:31:21

Directory /home/queppat/Projects/Java_projects/Intern/TaskManager

Total : 38 files,  3875 codes, 36 comments, 224 blanks, all 4135 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.env](/.env) | Properties | 0 | 0 | 1 | 1 |
| [README.md](/README.md) | Markdown | 28 | 0 | 12 | 40 |
| [backend/task-manager/.env.properties](/backend/task-manager/.env.properties) | Java Properties | 0 | 0 | 1 | 1 |
| [backend/task-manager/.mvn/wrapper/maven-wrapper.properties](/backend/task-manager/.mvn/wrapper/maven-wrapper.properties) | Java Properties | 3 | 0 | 1 | 4 |
| [backend/task-manager/mvnw.cmd](/backend/task-manager/mvnw.cmd) | Batch | 139 | 26 | 25 | 190 |
| [backend/task-manager/pom.xml](/backend/task-manager/pom.xml) | XML | 125 | 7 | 8 | 140 |
| [backend/task-manager/src/main/java/com/taskmanager/TaskManagerApplication.java](/backend/task-manager/src/main/java/com/taskmanager/TaskManagerApplication.java) | Java | 9 | 0 | 5 | 14 |
| [backend/task-manager/src/main/java/com/taskmanager/config/SecurityConfiguration.java](/backend/task-manager/src/main/java/com/taskmanager/config/SecurityConfiguration.java) | Java | 104 | 1 | 18 | 123 |
| [backend/task-manager/src/main/java/com/taskmanager/controller/AuthController.java](/backend/task-manager/src/main/java/com/taskmanager/controller/AuthController.java) | Java | 22 | 0 | 14 | 36 |
| [backend/task-manager/src/main/java/com/taskmanager/exception/EmptyRequestException.java](/backend/task-manager/src/main/java/com/taskmanager/exception/EmptyRequestException.java) | Java | 6 | 0 | 3 | 9 |
| [backend/task-manager/src/main/java/com/taskmanager/model/domain/Task.java](/backend/task-manager/src/main/java/com/taskmanager/model/domain/Task.java) | Java | 22 | 0 | 5 | 27 |
| [backend/task-manager/src/main/java/com/taskmanager/model/domain/User.java](/backend/task-manager/src/main/java/com/taskmanager/model/domain/User.java) | Java | 22 | 0 | 8 | 30 |
| [backend/task-manager/src/main/java/com/taskmanager/model/dto/entity/TaskDTO.java](/backend/task-manager/src/main/java/com/taskmanager/model/dto/entity/TaskDTO.java) | Java | 12 | 0 | 5 | 17 |
| [backend/task-manager/src/main/java/com/taskmanager/model/dto/entity/UserDTO.java](/backend/task-manager/src/main/java/com/taskmanager/model/dto/entity/UserDTO.java) | Java | 12 | 0 | 5 | 17 |
| [backend/task-manager/src/main/java/com/taskmanager/model/dto/request/RegisterRequest.java](/backend/task-manager/src/main/java/com/taskmanager/model/dto/request/RegisterRequest.java) | Java | 11 | 1 | 4 | 16 |
| [backend/task-manager/src/main/java/com/taskmanager/repository/UserRepository.java](/backend/task-manager/src/main/java/com/taskmanager/repository/UserRepository.java) | Java | 7 | 0 | 7 | 14 |
| [backend/task-manager/src/main/java/com/taskmanager/service/UserService.java](/backend/task-manager/src/main/java/com/taskmanager/service/UserService.java) | Java | 5 | 0 | 4 | 9 |
| [backend/task-manager/src/main/java/com/taskmanager/utils/CookieUtil.java](/backend/task-manager/src/main/java/com/taskmanager/utils/CookieUtil.java) | Java | 39 | 0 | 11 | 50 |
| [backend/task-manager/src/main/java/com/taskmanager/utils/JwtAuthenticationFilter.java](/backend/task-manager/src/main/java/com/taskmanager/utils/JwtAuthenticationFilter.java) | Java | 55 | 0 | 15 | 70 |
| [backend/task-manager/src/main/java/com/taskmanager/utils/JwtTokenProvider.java](/backend/task-manager/src/main/java/com/taskmanager/utils/JwtTokenProvider.java) | Java | 112 | 0 | 28 | 140 |
| [backend/task-manager/src/main/resources/application.yaml](/backend/task-manager/src/main/resources/application.yaml) | YAML | 38 | 0 | 0 | 38 |
| [backend/task-manager/src/test/java/com/taskmanager/TaskManagerApplicationTests.java](/backend/task-manager/src/test/java/com/taskmanager/TaskManagerApplicationTests.java) | Java | 9 | 0 | 5 | 14 |
| [frontend/README.md](/frontend/README.md) | Markdown | 9 | 0 | 8 | 17 |
| [frontend/eslint.config.js](/frontend/eslint.config.js) | JavaScript | 28 | 0 | 2 | 30 |
| [frontend/index.html](/frontend/index.html) | HTML | 13 | 0 | 1 | 14 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | 2,872 | 0 | 1 | 2,873 |
| [frontend/package.json](/frontend/package.json) | JSON | 27 | 0 | 1 | 28 |
| [frontend/public/vite.svg](/frontend/public/vite.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/src/App.css](/frontend/src/App.css) | PostCSS | 37 | 0 | 6 | 43 |
| [frontend/src/App.jsx](/frontend/src/App.jsx) | JavaScript JSX | 32 | 0 | 4 | 36 |
| [frontend/src/assets/react.svg](/frontend/src/assets/react.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/src/components/auth/LoginForm/LoginForm.css](/frontend/src/components/auth/LoginForm/LoginForm.css) | PostCSS | 0 | 0 | 1 | 1 |
| [frontend/src/components/auth/LoginForm/LoginForm.jsx](/frontend/src/components/auth/LoginForm/LoginForm.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [frontend/src/components/auth/RegisterForm/RegisterForm.css](/frontend/src/components/auth/RegisterForm/RegisterForm.css) | PostCSS | 0 | 0 | 1 | 1 |
| [frontend/src/components/auth/RegisterForm/RegisterForm.jsx](/frontend/src/components/auth/RegisterForm/RegisterForm.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [frontend/src/index.css](/frontend/src/index.css) | PostCSS | 61 | 0 | 8 | 69 |
| [frontend/src/main.jsx](/frontend/src/main.jsx) | JavaScript JSX | 9 | 0 | 2 | 11 |
| [frontend/vite.config.js](/frontend/vite.config.js) | JavaScript | 5 | 1 | 2 | 8 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)