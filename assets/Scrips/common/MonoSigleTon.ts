class MonoSingleton<T extends MonoSingleton<T>> {
    private static instance: MonoSingleton<any> | null = null;

    protected constructor() {
        // Protected constructor to prevent external instantiation
    }

    public static getInstance<T extends MonoSingleton<T>>(this: new () => T): T {
        if (!MonoSingleton.instance) {
            MonoSingleton.instance = new this();
        }
        return MonoSingleton.instance as T;
    }
}

