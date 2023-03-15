echo "************Patching Node Modules***************"

BIG_INTEGER_FILE_PATH="node_modules/big-integer/BigInteger.js"
echo "> Patching '$BIG_INTEGER_FILE_PATH'"
if ! grep -q 'v.startsWith("0x")' $BIG_INTEGER_FILE_PATH
then
    BIG_INT_INTEGER_FUNCTION="if (typeof v === \"undefined\") return Integer\[0\];"
    BIG_INT_INTEGER_FUNCTION_REPLACE="if (typeof v === \"undefined\") return Integer[0];\n\t\tif (typeof v === \"string\" \&\& v.startsWith(\"0b\")) {radix = 2;v = v.slice(2);}\n\t\tif (typeof v === \"string\" \&\& v.startsWith(\"0o\")) {radix = 8;v = v.slice(2);}\n\t\tif (typeof v === \"string\" \&\& v.startsWith(\"0x\")) {radix = 16;v = v.slice(2);}"
    sed -i "s/$BIG_INT_INTEGER_FUNCTION/$BIG_INT_INTEGER_FUNCTION_REPLACE/" $BIG_INTEGER_FILE_PATH
fi

REACT_NATIVE_CRYPTO_FILE_PATH="node_modules/react-native-crypto/index.js"
echo "> Patching '$REACT_NATIVE_CRYPTO_FILE_PATH'"
if ! grep -q 'expo-random' $REACT_NATIVE_CRYPTO_FILE_PATH
then
    CRYPTO_IMPORT_STATEMENT="import { randomBytes } from 'react-native-randombytes'"
    CRYPTO_IMPORT_STATEMENT_REPLACE="import { getRandomBytes as randomBytes } from 'expo-random'"
    sed -i "s/$CRYPTO_IMPORT_STATEMENT/$CRYPTO_IMPORT_STATEMENT_REPLACE/" $REACT_NATIVE_CRYPTO_FILE_PATH
fi

NOBLE_ED25519_FILE_PATH="node_modules/@noble/ed25519/lib/index.js"
echo "> Patching '$NOBLE_ED25519_FILE_PATH'"
if ! grep -q '(num < max)' $NOBLE_ED25519_FILE_PATH
then
    NOBLE_ED25519_STATEMENT="(typeof num === 'bigint' \&\& num < max)"
    NOBLE_ED25519_STATEMENT_REPLACE="(num < max)"
    sed -i "s/$NOBLE_ED25519_STATEMENT/$NOBLE_ED25519_STATEMENT_REPLACE/" $NOBLE_ED25519_FILE_PATH
fi
