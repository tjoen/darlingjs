'use strict';
/**
 * Project: GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

describe('system', function() {
    var defaultModule,
        defaultWorld;
    beforeEach(function() {
        defaultModule = GameEngine.module('defaultModule', {})
            .system('defaultSystem');
        defaultWorld = GameEngine.world('defaultWorld', ['defaultModule']);
    });

    afterEach(function() {
        GameEngine.removeAllModules();
        GameEngine.removeAllWorlds();
    });

    it('should be added to the module', function() {
        var m = GameEngine.module('theModule', {})
            .system('theSystem');

        expect(m.has('theSystem')).toBe(true);
    });

    it('should be added to the world', function() {
        GameEngine.module('testModule', {})
            .system('testSystem');

        var world = GameEngine.world('testWorld', ['testModule']);
        world.$add('testSystem');
        expect(world.$isUse('testSystem')).toBe(true);
    });

    it('should has no any nodes by default', function() {
        var system = defaultWorld.$add('defaultSystem');
        expect(system.$nodes.length()).toBe(0);
    });

    it(' after been added to world should fetch required nodes from world', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.$e('theEntity', ['theComponent']);
        world.$add(entity);
        var system = world.$add('testSystem');
        expect(system.$nodes.length()).toBe(1);
        system.$nodes.forEach(function(e) {
            expect(e).toBe(entity);
        });
    });

    it('should fetch entity to $nodes after entity been added', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.$e('theEntity', ['theComponent']);
        var system = world.$add('testSystem');
        world.$add(entity);
        expect(system.$nodes.length()).toBe(1);
        system.$nodes.forEach(function(e) {
            expect(e).toBe(entity);
        });
    });

    it('should remove entity from $nodes after entity been removed', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.$e('theEntity', ['theComponent']);
        var system = world.$add('testSystem');
        world.$add(entity);
        world.$remove(entity);
        expect(system.$nodes.length()).toBe(0);
    });

    it('should fetch entity to $nodes after required component been added to entity', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.$e('theEntity');
        var system = world.$add('testSystem');
        world.$add(entity);
        entity.$add('theComponent');

        expect(system.$nodes.length()).toBe(1);
        system.$nodes.forEach(function(e) {
            expect(e).toBe(entity);
        });
    });

    it('should remove entity from $nodes after required component been removed from entity', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.$e('theEntity', ['theComponent']);
        var system = world.$add('testSystem');
        world.$add(entity);
        entity.$remove('theComponent');
        expect(system.$nodes.length()).toBe(0);
    });

    it('should invoke $added on system added to world', function() {
        var addedHandler = sinon.spy();
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $added: addedHandler
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        world.$add('testSystem');

        expect(addedHandler.callCount).toBe(1);
    });

    it('should invoke $removed on system remove from world', function() {
        var removedHandler = sinon.spy();
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $removed: removedHandler
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var system = world.$add('testSystem');
        world.$add(world.$e('theEntity', ['theComponent']));
        world.$remove(system);

        expect(removedHandler.callCount).toBe(1);
        expect(system.$nodes.length()).toBe(0);
    });

    it('should run update once for $nodes request.', function() {
        var updateHandler = sinon.spy();
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent'],
                $update: ['$nodes', '$time', updateHandler]
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var system = world.$add('testSystem');
        world.$update(11);

        expect(updateHandler.callCount).toBe(1);
        expect(updateHandler.calledWith(system.$nodes, 11)).toBeTruthy();
    });

    it('should inject the World instance to update by $world argument', function() {
        var updateHandler = sinon.spy();
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent'],
                $update: ['$world', updateHandler]
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        world.$add('testSystem');
        world.$update(11);
        expect(updateHandler.callCount).toBe(1);
        expect(updateHandler.calledWith(world)).toBeTruthy();
    });

    it('should run update for each request $node.', function() {
        var updateHandler = sinon.spy();
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                $require: ['theComponent'],
                $update: ['$node', '$time', updateHandler]
            });

        var world = GameEngine.world('testWorld', ['testModule']);

        world.$add('testSystem');

        var entities = [];
        for(var i = 0, l = 3; i < l; i++) {
            var e = world.$e('theEntity_' + i, ['theComponent']);
            entities.push(world.$add(e));
        }

        world.$update(11);

        expect(updateHandler.callCount).toBe(3);
        expect(updateHandler.calledWith(entities[0], 11)).toBeTruthy();
        expect(updateHandler.calledWith(entities[1], 11)).toBeTruthy();
        expect(updateHandler.calledWith(entities[2], 11)).toBeTruthy();
    });

    it('should inject dependency in $init', function() {
        //TODO : Write test: System should inject dependency in $init.
    });

    it('should inject dependency in $update.', function() {

    });

    //TODO
    //
    //addNode, removeNode
})