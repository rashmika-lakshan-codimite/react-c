EMCC = emcc
EMCC_FLAGS = -g \
			 -s WASM=1 \
             -s EXPORTED_FUNCTIONS='["_add", "_factorial"]' \
             -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' \
             -s MODULARIZE=1 \
             -s EXPORT_NAME="createModule" \
             -s ENVIRONMENT=web \
             -s ALLOW_MEMORY_GROWTH=1 \
             -s NO_EXIT_RUNTIME=1 \
             -s EXPORT_ES6=1 \
             -O3

all: math.js

math.js: wasm/math.c
	mkdir -p src/wasm
	$(EMCC) $(EMCC_FLAGS) wasm/math.c -o src/wasm/math.js
	@echo "Generated WebAssembly module:"

clean:
	rm -f src/wasm/math.js src/wasm/math.wasm