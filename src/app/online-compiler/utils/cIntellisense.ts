// C language uses the same parser as C++ but with simpler syntax
import { registerCppCompletion } from './cppIntellisense';

// C is essentially a subset of C++, so we can reuse the C++ parser
// The main differences are:
// - No classes (only structs)
// - No member functions
// - Simpler syntax

export const registerCCompletion = registerCppCompletion;
