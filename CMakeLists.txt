cmake_minimum_required(VERSION 3.2)

project(signals C)



find_path(LIBUV_INCLUDE_DIR uv.h REQUIRED)
find_library(LIBUV_LIBRARY NAMES libuv REQUIRED)


add_executable(
    client 
    main.c
)


target_include_directories(
    client
    PRIVATE ${LIBUV_INCLUDE_DIR}
)


target_link_libraries(
    client
    ${LIBUV_LIBRARY}
)

