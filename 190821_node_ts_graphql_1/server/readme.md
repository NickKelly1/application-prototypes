See video series:
https://www.youtube.com/playlist?list=PLN3n1USn4xlltIGRInnlHtsOdvHIUQFHL


Note: In development on windows with docker, fs-events are not passed through hypervisor, meaning the auto-server-restarting tool (be it nodemon or ts-node-dev) needs to run in a polling (/legacy) mode
nodemon: https://github.com/remy/nodemon/issues/1447
ts-node-dev: https://github.com/whitecolor/ts-node-dev/issues/55