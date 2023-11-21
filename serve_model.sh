#!/bin/bash
MODEL_DIR="custom_net"
REST_PORT=8501
MODEL_NAME=digit_model
tensorflow_model_server    --rest_api_port=$REST_PORT \
                           --model_base_path=$(pwd)/$MODEL_DIR \
                           --model_name=$MODEL_NAME \
                           --rest_api_enable_cors_support=true \
                           --model_config_file=model_config.proto
