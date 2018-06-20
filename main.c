#include <stdio.h>
#include <stdbool.h>

#include <uv.h>


uv_signal_t sigint;
uv_signal_t sighup;
uv_signal_t sigbreak;
uv_loop_t *loop;


static void signal_handler(uv_signal_t *handle, int signum) {
    
    fprintf(stderr, "Signal received: %d\n", signum);
    exit(signum);
};

int main() {

    loop = uv_default_loop();
 
    uv_signal_init(loop, &sigint);
    uv_signal_init(loop, &sighup);
    uv_signal_init(loop, &sigbreak);

    uv_signal_start(&sigint, signal_handler, SIGINT);
    uv_signal_start(&sighup, signal_handler, SIGHUP);
    uv_signal_start(&sigbreak, signal_handler, SIGBREAK);

    uv_run(loop, UV_RUN_DEFAULT);

    uv_signal_stop(&sigint);
    uv_signal_stop(&sighup);
    uv_signal_stop(&sigbreak);

    uv_stop(loop);

    return 0;
}