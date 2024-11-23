pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";


// check_age.circom
template CheckAge() {
    signal input birthYear;  // Year of birth
    signal input birthMonth; // Month of birth
    signal input birthDay;   // Day of birth
    signal input currentYear;
    signal input currentMonth;
    signal input currentDay;
    signal output isAdult;

    component eq1 = LessEqThan(21);
    eq1.in[0] <== (currentYear - birthYear) * 10000 + (currentMonth - birthMonth) * 100 + (currentDay - birthDay);
    eq1.in[1] <== 180000;
    
    // component eq1 = GreaterEqThan()
    // eq1.in[0] <== ageCheck;
    // eq1.in[1] <== 0;

    // component mux1 = Mux1();
    // mux1.s <== eq1.out;
    // mux1.c[0] <== 1
    // mux1.c[1] <== 0;

    // isAdult mix1.out;

    isAdult <== eq1.out;
}

component main = CheckAge();
