import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:formation_flutter/res/app_colors.dart';
import 'package:formation_flutter/services/pocketbase_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _emailError;
  String? _passwordError;
  String? _serverError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String _parseError(dynamic e) {
    if (e is ClientException) {
      if (e.statusCode == 0) {
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      }
      if (e.statusCode == 400) {
        final data = e.response['data'] as Map<String, dynamic>?;
        if (data != null && data.containsKey('email')) {
          final code = (data['email'] as Map<String, dynamic>?)?['code'];
          if (code == 'validation_not_unique') {
            return 'Cette adresse email est déjà utilisée.';
          }
          if (code == 'validation_invalid_email') {
            return 'Adresse email invalide.';
          }
        }
        return 'Données invalides. Vérifiez les informations saisies.';
      }
      return 'Erreur serveur (${e.statusCode}). Veuillez réessayer.';
    }
    return 'Une erreur inattendue est survenue.';
  }

  Future<void> _register() async {
    setState(() {
      _emailError = null;
      _passwordError = null;
      _serverError = null;
    });

    bool valid = true;
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      setState(() => _emailError = 'Veuillez saisir votre email');
      valid = false;
    } else if (!RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email)) {
      setState(() => _emailError = 'Adresse email invalide');
      valid = false;
    }
    if (_passwordController.text.isEmpty) {
      setState(() => _passwordError = 'Veuillez saisir un mot de passe');
      valid = false;
    } else if (_passwordController.text.length < 8) {
      setState(() => _passwordError = 'Au moins 8 caractères requis');
      valid = false;
    }
    if (!valid) return;

    setState(() => _isLoading = true);
    try {
      final pb = PocketBaseService.instance.client;
      await pb
          .collection('users')
          .create(
            body: {
              'email': email,
              'password': _passwordController.text,
              'passwordConfirm': _passwordController.text,
            },
          );
      await pb
          .collection('users')
          .authWithPassword(email, _passwordController.text);
      if (mounted) context.go('/');
    } catch (e) {
      if (mounted) setState(() => _serverError = _parseError(e));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 48),
                Text(
                  'Inscription',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppColors.blue,
                    fontFamily: 'Avenir',
                    fontSize: 20.0,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 79),
                _AuthField(
                  controller: _emailController,
                  hint: 'Adresse email',
                  icon: Icons.email,
                  keyboardType: TextInputType.emailAddress,
                  errorText: _emailError,
                ),
                const SizedBox(height: 14),
                _AuthField(
                  controller: _passwordController,
                  hint: 'Mot de passe',
                  icon: Icons.lock,
                  obscureText: true,
                  errorText: _passwordError,
                ),
                if (_serverError != null) ...[
                  const SizedBox(height: 16),
                  _ErrorBanner(message: _serverError!),
                ],
                const SizedBox(height: 30),
                _PillButton(
                  label: "S'inscrire",
                  onPressed: _isLoading ? null : _register,
                  isLoading: _isLoading,
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.go('/login'),
                  child: const Text(
                    "J'ai déjà un compte",
                    style: TextStyle(
                      color: AppColors.blue,
                      fontFamily: 'Avenir',
                    ),
                  ),
                ),
                const SizedBox(height: 48),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.nutrientLevelHigh.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.nutrientLevelHigh.withValues(alpha: 0.4),
        ),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.error_outline,
            color: AppColors.nutrientLevelHigh,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: AppColors.nutrientLevelHigh,
                fontFamily: 'Avenir',
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AuthField extends StatelessWidget {
  const _AuthField({
    required this.controller,
    required this.hint,
    required this.icon,
    this.keyboardType,
    this.obscureText = false,
    this.errorText,
  });

  final TextEditingController controller;
  final String hint;
  final IconData icon;
  final TextInputType? keyboardType;
  final bool obscureText;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      style: const TextStyle(fontFamily: 'Avenir', color: AppColors.blue),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(
          color: AppColors.grey3,
          fontFamily: 'Avenir',
          fontWeight: FontWeight.w500,
          fontSize: 15,
        ),
        prefixIcon: Icon(icon, color: AppColors.blue, size: 20),
        errorText: errorText,
        errorStyle: const TextStyle(fontFamily: 'Avenir', fontSize: 12),
        filled: true,
        fillColor: AppColors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.grey2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.grey2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.blue, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.nutrientLevelHigh),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(
            color: AppColors.nutrientLevelHigh,
            width: 1.5,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(
          vertical: 12,
          horizontal: 12,
        ),
      ),
    );
  }
}

class _PillButton extends StatelessWidget {
  const _PillButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 89),
      child: SizedBox(
        height: 45,
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.yellow,
            foregroundColor: AppColors.blue,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(22),
            ),
            elevation: 0,
            padding: const EdgeInsets.only(left: 26, right: 28),
          ),
          child: isLoading
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.blue,
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        fontFamily: 'Avenir',
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                      ),
                    ),
                    const Icon(Icons.arrow_forward, size: 18),
                  ],
                ),
        ),
      ),
    );
  }
}
