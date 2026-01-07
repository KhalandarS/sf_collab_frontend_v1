export function isUserProfileComplete(user) {
    if (!user) return false;

    const requiredFields = [
        'email',
        'firstName',
        'lastName',
        'roles',
    ];
  
    for (const field of requiredFields) {
        const value = user[field];
        if (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
            return false;
        }
    }

    return true;
} 