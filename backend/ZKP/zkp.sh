# Compile the circuit
circom check_age.circom --r1cs --wasm --sym

# # Generate proving and verification keys
snarkjs groth16 setup check_age.r1cs check_age_0000.zkey
# snarkjs zkey contribute check_age_0000.zkey check_age_final.zkey --name="1st Contributor Name"
# snarkjs zkey export verificationkey check_age_final.zkey verification_key.json

# # Generate a proof
# snarkjs groth16 prove check_age_final.zkey witness.wtns proof.json public.json

# # Verify the proof
# snarkjs groth16 verify verification_key.json public.json proof.json
